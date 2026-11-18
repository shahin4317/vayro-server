
import { Router } from "express";
import multer from "multer";

import cloudinary from "../config/cloudinary.js";

const router = Router();


// MULTER

const upload = multer({

    storage: multer.memoryStorage(),

    limits: {
        fileSize: 5 * 1024 * 1024
    },

    fileFilter: (req, file, cb) => {

        const allowedTypes = [
            "image/jpeg",
            "image/png",
            "image/webp"
        ];

        if (allowedTypes.includes(file.mimetype)) {

            cb(null, true);

        } else {

            cb(new Error("Invalid image format"));

        }

    }

});


// UPLOAD API

router.post("/upload/image", (req, res, next) => {

    upload.single("image")(req, res, (error) => {

        if (error) {

            return res.status(400).json({

                success: false,

                message: error.message

            });

        }

        next();

    });

}, async (req, res) => {

    try {

        if (!req.file) {

            return res.status(400).json({

                success: false,

                message: "Please select an image"

            });

        }


        // CLOUDINARY UPLOAD

        const result = await new Promise((resolve, reject) => {

            const stream = cloudinary.uploader.upload_stream(

                {
                    folder: "vayro/hero-banners",
                    resource_type: "image"
                },

                (error, result) => {

                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }

                }

            );

            stream.end(req.file.buffer);

        });


        // RESPONSE

        res.status(201).json({

            success: true,

            message: "Image uploaded successfully",

            data: {

                imageUrl: result.secure_url,

                publicId: result.public_id,

                width: result.width,

                height: result.height,

                format: result.format

            }

        });


    } catch (error) {

        console.error("Cloudinary Error:", error);

        res.status(500).json({

            success: false,

            message: error.message || "Upload failed"

        });

    }

});


export default router;
