import { Badge, Box, IconButton, Menu, MenuItem } from "@mui/material";
import { useState } from "react";
import useNotifications from "../../data/_3_ManagerNotificationsUser/useNotifications";
import { INotifaction } from "../../data/notification";

import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import NewspaperIcon from "@mui/icons-material/Newspaper";
import OndemandVideoIcon from "@mui/icons-material/OndemandVideo";
import PhotoCameraFrontIcon from "@mui/icons-material/PhotoCameraFront";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import ClearIcon from "@mui/icons-material/Clear";
import ManagerNotificationsUser from "../../data/_3_ManagerNotificationsUser/ManagerNotificationsUser";
import { useNavigate } from "react-router-dom";

export default function ButtonNotifications() {
  const navigate = useNavigate();
  const managerNotificationsUser = ManagerNotificationsUser;
  const notifications = useNotifications();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) =>
    setAnchorEl(event.currentTarget);

  const handleClose = () => setAnchorEl(null);

  const handleClickNotification = (notification: INotifaction) => {
    managerNotificationsUser.deleteNotification(notification);
    navigate(
      `/channels/${notification.idChannelOrigin}/posts/${notification.idPost}`
    );
  };

  return (
    <>
      <IconButton onClick={handleClick}>
        <Badge badgeContent={notifications.length} color="primary">
          <NotificationsNoneOutlinedIcon />
        </Badge>
      </IconButton>
      <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleClose}>
        {notifications.length === 0 ? (
          <MenuItem>No notifications</MenuItem>
        ) : null}
        {notifications.map((notification, idx) => (
          <MenuItem
            key={idx}
            onClick={() => handleClickNotification(notification)}
          >
            <Box>
              <Box
                sx={{ display: "flex", gap: "0.5rem", alignItems: "center" }}
              >
                <Box>
                  {notification.typeContnet === "quote" ? (
                    <FormatQuoteIcon color="primary" />
                  ) : null}
                  {notification.typeContnet === "article" ? (
                    <NewspaperIcon color="primary" />
                  ) : null}
                  {notification.typeContnet === "photo" ? (
                    <PhotoCameraIcon color="primary" />
                  ) : null}
                  {notification.typeContnet === "video" ? (
                    <OndemandVideoIcon color="primary" />
                  ) : null}
                </Box>
                <Box>{notification.usernameSender}</Box>
                <Box>
                  {notification.typeNotification === "comment" ? "-" : null}
                </Box>
                <Box color="info">
                  {notification.textComment.slice(0, 20)}...
                </Box>
                <IconButton
                  size="small"
                  onClick={() => {
                    managerNotificationsUser.deleteNotification(notification);
                  }}
                >
                  <ClearIcon fontSize="small" />
                </IconButton>
              </Box>
            </Box>
          </MenuItem>
        ))}
      </Menu>
    </>
  );
}
