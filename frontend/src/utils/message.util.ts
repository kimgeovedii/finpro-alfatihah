import Swal from "sweetalert2"

export const showPopUp = async (title: string, text: string, icon: "success" | "error" | "warning" | "info" | "question", confirmButtonColor?: string | null, action?: () => void) => {
    const result = await Swal.fire({
        title, html: text, icon,
        confirmButtonColor: confirmButtonColor ?? "#10b981",
    })
    if (action) action()
    
    return result
}
  
export const showLoading = (title: string = "Loading...", text: string = "Please wait a moment") => {
    Swal.fire({
        title,
        text,
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading()
    })
}

export const closePopUp = () => document.dispatchEvent(new KeyboardEvent("keydown", { key: "Escape" }))

export const closeLoading = () => Swal.close()