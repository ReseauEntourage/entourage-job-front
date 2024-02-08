import { useEffect } from "react"

export const useSuccessNotification = (
    status: boolean,
    message: string,
) => {
    useEffect(() => {
        if (status) {
            alert(message)
        }
    }, [])
}

export const useFailedNotification = (
    status: boolean,
    message: string,
) => {
    useEffect(() => {
        if (status) {
            alert(message)
        }
    }, [])
}