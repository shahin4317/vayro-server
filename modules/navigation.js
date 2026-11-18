
import { Router } from "express";
import { ObjectId } from "mongodb";
import { db } from "../config/db.js";

const router = Router();

const categoryCollection = db.collection("categories");


// POST - ADD CATEGORY

router.post("/categories", async (req, res) => {
    try {
        const { name, slug, parentId, showInNav } = req.body;

        const category = {
            name,
            slug,
            parentId: parentId ? new ObjectId(parentId) : null,
            showInNav: showInNav ?? true,
            createdAt: new Date(),
        };

        const result = await categoryCollection.insertOne(category);

        res.status(201).json({
            success: true,
            message: "Category added successfully",
            data: result,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


// GET - SHOW ALL CATEGORIES

router.get("/categories", async (req, res) => {
    try {
        const result = await categoryCollection.find().toArray();

        res.status(200).json({
            success: true,
            data: result,
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
        });
    }
});


export default router;

