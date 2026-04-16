import { Request } from "express"
import multer from "multer"
import path from "path"
import fs from "fs"
import { allowedExtensionsPaymentEvidence, allowedMimeTypesPaymentEvidence, maxSizePaymentEvidence } from "../constants/business.const"

export const uploader = (filePrefix: string, folderDir: string) => {
    const uploadPath = path.join(__dirname, "../public", folderDir)

    // Create dir if not exist
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true })
    }

    // Config the file upload
    const storage = multer.diskStorage({
        destination: (req: Request, file, cb) => {
            cb(null, uploadPath)
        },
        filename: (req: Request, file, cb) => {
            const ext = path.extname(file.originalname).toLowerCase()
            const newName = `${filePrefix}_${Date.now()}${ext}`
            cb(null, newName)
        }
    })

    // File validation
    const fileFilter: multer.Options["fileFilter"] = (req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase()

        if (!allowedMimeTypesPaymentEvidence.includes(file.mimetype)) {
            const error: any = new Error("Only JPG, JPEG, and PNG images are allowed")
            error.status = 400
            return cb(error)
        }

        if (!allowedExtensionsPaymentEvidence.includes(ext)) {
            const error: any = new Error("Invalid file extension")
            error.status = 400
            return cb(error)
        }

        cb(null, true)
    }

    return multer({
        storage,
        fileFilter,
        limits: { fileSize: maxSizePaymentEvidence }
    })
}

export const memoryUploader = () => {
    return multer({
        storage: multer.memoryStorage(),
        limits: { fileSize: maxSizePaymentEvidence },
        fileFilter: (req, file, cb) => {
            if (!allowedMimeTypesPaymentEvidence.includes(file.mimetype)) {
                const error: any = new Error("Only JPG, JPEG, and PNG images are allowed")
                error.status = 400  
                return cb(error)
            }
            cb(null, true)
        }
    })
}
