import Swal from "sweetalert2"

export const showPopUp = async (title: string, text: string, icon: "success" | "error" | "warning" | "info" | "question", confirmButtonColor?: string | null, action?: () => void) => {
    const result = await Swal.fire({
        title, html: text, icon,
        confirmButtonColor: confirmButtonColor ?? "#10b981",
    })
    if (action) action()
    
    return result
}
  