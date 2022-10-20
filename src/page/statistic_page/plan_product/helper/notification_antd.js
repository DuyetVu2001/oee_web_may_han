import {
    notification,
} from "antd";

export const openNotificationWithIcon = (type, description, message = "Thông báo") => {
    if (type && notification[type])
        notification[type]({
            message: JSON.stringify(message),
            description: JSON.stringify(description),
            duration: 3,
            style: { marinTop: "56px" },
        });
};