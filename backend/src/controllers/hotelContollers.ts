import { NextFunction, Request, Response } from "express";
import cloudinary from "cloudinary";
import Hotel from "../models/hotel";
import { HotelType } from "../shared/types";

//This is for getting all hotels
export const getAllHotels = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const hotels = await Hotel.find({ userId: req.userId });
    res.json(hotels);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
};

//this is for adding a hotel
export const hotels = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const imageFiles = req.files as Express.Multer.File[];
    const newHotel: HotelType = req.body;

    //1. upload images to cloudinary

    const imageUrls = await uploadImages(imageFiles);
    newHotel.imageUrls = imageUrls;
    newHotel.lastUpdated = new Date();
    newHotel.userId = req.userId;

    //3. save the new hotel in our database

    const hotel = new Hotel(newHotel);
    await hotel.save();

    //4. return a 201 status
    res.status(201).send(hotel);
  } catch (e) {
    console.log("Error creatindg hotel: ", e);
    res.status(500).json({ message: "Something went wrong!" });
  }
};

//api for taking you to the page you want to edit
export const takeHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //Getting the id from params
  const id = req.params.id.toString();

  try {
    const hotel = await Hotel.findOne({
      _id: id,
      userId: req.userId,
    });
    res.json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Error fetching hotels" });
  }
};

//Api for editing the hotel
export const editHotel = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const updatedHotel: HotelType = req.body;
    updatedHotel.lastUpdated = new Date();

    const hotel = await Hotel.findByIdAndUpdate(
      {
        _id: req.params.hotelId,
        userId: req.userId,
      },
      updatedHotel,
      { new: true }
    );

    if (!hotel) {
      return res.status(404).json({ message: "Hotel NOT found" });
    }

    const files = req.files as Express.Multer.File[];

    const updatedImageUrls = await uploadImages(files);

    hotel.imageUrls = [...updatedImageUrls, ...(updatedHotel.imageUrls || [])];

    await hotel.save();
    res.status(201).json(hotel);
  } catch (error) {
    res.status(500).json({ message: "Something went wrong" });
  }
};

//refactor
async function uploadImages(imageFiles: Express.Multer.File[]) {
  const uploadPromises = imageFiles.map(async (image) => {
    const b64 = Buffer.from(image.buffer).toString("base64");
    //Telling what type of image we are going to tell cloudinary to upload!!
    let dataURI = "data:" + image.mimetype + ";base64," + b64;
    const res = await cloudinary.v2.uploader.upload(dataURI);
    return res.url;
  });

  //2. if upload was successful, add the URLS to the new hotel
  const imageUrls = await Promise.all(uploadPromises);
  return imageUrls;
}
