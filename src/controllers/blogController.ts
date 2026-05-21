import { Request, Response } from "express"
import cloudinary from "../config/cloudinary"
import { BlogModel } from "../models/blogModel"
import { AuthRequest } from "../middleware/auth"

export const saveBlog = async (req: AuthRequest, res: Response) => {
  const { title, content } = req.body
  try {
    let imageUrl = ""
    if (req?.file) {
      const result: any = await new Promise((resole, reject) => {
        const upload_stream = cloudinary.uploader.upload_stream(
          { folder: "blog" },
          (error, result) => {
            if (error) {
              return reject(error)
            }
            resole(result) // success return
          }
        )
        upload_stream.end(req.file?.buffer)
      })
      imageUrl = result.secure_url // image link
    }

    const newBlog = new BlogModel({
      title,
      content,
      imageURL: imageUrl,
      author: req.user.sub
    })

    await newBlog.save()

    res.status(201).json({ message: "Blog created..!", data: newBlog })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Fail to create blog" })
  }
}

// pagination
// 10
// p1 - 1-10
// p2 - 11-20
// page, limit
// query params
// v1/blog?page=1&limit=10
export const getAllBlogs = async (req: Request, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10

  const skip = (page - 1) * limit

  try {
    const blogs = await BlogModel.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalDataCount = await BlogModel.countDocuments()

    res.status(200).json({
      message: "blogs data",
      data: blogs,
      totalPage: Math.ceil(totalDataCount / limit),
      totalDataCount,
      page
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch blogs" })
  }
}

export const getMyBlogs = async (req: AuthRequest, res: Response) => {
  const page = parseInt(req.query.page as string) || 1
  const limit = parseInt(req.query.limit as string) || 10

  const skip = (page - 1) * limit

  try {
    const blogs = await BlogModel.find({ author: req.user.sub })
      .populate("author", "name email")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)

    const totalDataCount = await BlogModel.countDocuments({
      author: req.user.sub
    })

    res.status(200).json({
      message: "blogs data",
      data: blogs,
      totalPage: Math.ceil(totalDataCount / limit),
      totalDataCount,
      page
    })
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Failed to fetch blogs" })
  }
}
