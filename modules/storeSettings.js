
import { Router } from "express";
import { db } from "../config/db.js";

const router = Router();

const storeSettingsCollection = db.collection("storeSettings");


// ADD HERO BANNER

router.post("/storeSettings/hero-banners", async (req, res) => {

    try {

        // 1. GET DATA

        const { imageUrl, publicId, order, isActive } = req.body;


        // 2. CHECK DATA

        if (!imageUrl || !publicId) {

            return res.status(400).json({

                success: false,
                message: "Image URL and Public ID are required"

            });

        }


        // 3. CREATE BANNER OB  JECT

        const bannerData = {

            imageUrl,

            publicId ,

            order: Number(order) || 1,

            isActive: isActive ?? true,

            createdAt: new Date()

        };


        // 4. SAVE BANNER IN ARRAY

        await storeSettingsCollection.updateOne(

            { _id: "main" },

            {
                $setOnInsert: {
                    storeName: "VAYRO",
                    createdAt: new Date()
                },

                $push: {
                    heroBanners: bannerData
                },

                $set: {
                    updatedAt: new Date()
                }
            },

            { upsert: true }

        );


        // 5. GET UPDATED SETTINGS

        const storeSettings = await storeSettingsCollection.findOne({
            _id: "main"
        });


        // 6. SEND RESPONSE

        res.status(201).json({

            success: true,

            message: "Hero banner added successfully",

            data: storeSettings.heroBanners

        });


    } catch (error) {

        res.status(500).json({

            success: false,

            message: error.message

        });

    }

});


export default router;
