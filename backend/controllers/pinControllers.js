import { Pin } from "../models/pinModel.js";
import TryCatch from "../utils/TryCatch.js";
import getDataUrl from "../utils/urlGenerator.js";
import cloudinary from "cloudinary";

export const createPin = TryCatch(async (req, res) => {
  const { title, pin } = req.body;

  const file = req.file;
  const fileUrl = getDataUrl(file);
  const cloud = await cloudinary.v2.uploader.upload(fileUrl.content);
  await Pin.create({
    title,
    pin,
    image: {
      id: cloud.public_id,
      url: cloud.secure_url,
    },
    owner: req.user._id,
  });
  res.json({
    message: "Pin Created",
  });
});

export const getAllPins = TryCatch(async (req, res) => {
  const pins = await Pin.find().sort({ createdAt: -1 });

  res.json(pins);
});

export const getSinglePin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id).populate("owner", "-password");

  res.json(pin);
});

export const deletePin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);

  if (!pin)
    return res.status(400).json({
      message: "No pin with this id",
    });

  if (pin.owner.toString() !== req.user._id.toString())
    return res.status(403).json({
      message: "Unauthorized",
    });
  await cloudinary.v2.uploader.destroy(pin.image.id);
  await pin.deleteOne();

  res.json({
    message: "Pin Deleted",
  });
});

export const updatePin = TryCatch(async (req, res) => {
  const pin = await Pin.findById(req.params.id);

  if (!pin)
    return res.status(400).json({
      message: "No pin with this id",
    });

  if (pin.owner.toString() !== req.user._id.toString())
    return res.status(403).json({
      message: "Unauthorized",
    });

  pin.title = req.body.title;
  pin.pin = req.body.pin;

  await pin.save();
  res.json({
    message: "Pin updated",
  });
});
