import { Badge, Box, IconButton, Menu } from "@mui/material";
import { useState } from "react";
import useNotifications from "../../data/_3_ManagerNotificationsUser/useNotifications";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { Form } from "react-router-dom";

export default function ButtonNotifications() {
  const notifications = useNotifications();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  return (
    <>
      <IconButton onClick={handleClick}>
        <Badge badgeContent={notifications.length} color="primary">
          <NotificationsNoneOutlinedIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {notifications.map((notification, idx) => (
          <Box key={idx}>
            <Box>
              {notification.typeContnet === "quote" ? (
                <FormatQuoteIcon />
              ) : null}
              {notification.typeContnet === "article" ? (
                <NewspaperIcon />
              ) : null}
              {notification.typeContnet === "photo" ? (
                <PhotoCameraIcon />
              ) : null}
              {notification.typeContnet === "video" ? (
                <OndemandVideoIcon />
              ) : null}
            </Box>
          </Box>
        ))}
      </Menu>
    </>
  );
}
