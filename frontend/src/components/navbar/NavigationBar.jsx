import React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import ListItemIcon from "@mui/material/ListItemIcon";
import { Link, useNavigate } from "react-router-dom";
import MenuIcon from "@mui/icons-material/Menu";
import { keyframes } from "@mui/system";
import {
  GroupAdd,
  Groups,
  Dashboard,
  Poll,
  ExitToApp
} from "@mui/icons-material";

// Animation for the menu button
const pulseAnimation = keyframes`
  0% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0.4); }
  70% { box-shadow: 0 0 0 12px rgba(74, 144, 226, 0); }
  100% { box-shadow: 0 0 0 0 rgba(74, 144, 226, 0); }
`;

export default function NavigationBar() {
  const [state, setState] = React.useState({ left: false });
  const navigate = useNavigate();

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }
    setState({ left: open });
  };

  const handleSignOut = async () => {
    try {
      navigate("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navLinks = [
      { text: "Dashboard", path: "/dashboard", icon: <Dashboard /> },
      { text: "View all interns", path: "/viewAllIntern", icon: <Groups /> },
      { text: "Add intern", path: "/form", icon: <GroupAdd /> },
    { text: "Poll Vote", path: "/pollVote", icon: <Poll /> },
    { text: "Create project", path: "/createProject", icon: <Poll /> },
    { text: "Available project", path: "/projectAssignment", icon: <Poll /> },
  ];

  const list = (
    <Box
      sx={{
        width: 280,
        height: "100%",
        background: "linear-gradient(135deg, #1a2a6c 0%, #4b6cb7 100%)",
        color: "white",
        paddingTop: "2rem"
      }}
      role="presentation"
      onClick={toggleDrawer(false)}
      onKeyDown={toggleDrawer(false)}
    >
      <List>
        
        {navLinks.map((link) => (
          <ListItem key={link.text} disablePadding>
            <ListItemButton component={Link} to={link.path}>
              <ListItemIcon sx={{ color: "white" }}>{link.icon}</ListItemIcon>
              <ListItemText primary={link.text} />
            </ListItemButton>
          </ListItem>
        ))}
        
        <ListItem disablePadding>
          <ListItemButton onClick={handleSignOut}>
            <ListItemIcon sx={{ color: "white" }}><ExitToApp /></ListItemIcon>
            <ListItemText primary="Sign Out" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <>
      <Button
        onClick={toggleDrawer(true)}
        sx={{
          position: "fixed",
          top: "2rem",
          left: "2rem",
          zIndex: 999,
          minWidth: "56px",
          height: "56px",
          borderRadius: "50%",
          background: "linear-gradient(135deg, #4b6cb7 0%, #1a2a6c 100%)",
          color: "white",
          boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
          animation: `${pulseAnimation} 2s infinite`,
          "&:hover": {
            background: "linear-gradient(135deg, #1a2a6c 0%, #4b6cb7 100%)",
            transform: "scale(1.1)",
            boxShadow: "0 6px 24px rgba(0,0,0,0.3)"
          },
          transition: "all 0.3s ease"
        }}
      >
        <MenuIcon fontSize="large" />
      </Button>
      
      <Drawer
        anchor="left"
        open={state.left}
        onClose={toggleDrawer(false)}
        sx={{
          "& .MuiDrawer-paper": {
            borderRight: "none",
            boxShadow: "4px 0 20px rgba(0,0,0,0.1)"
          }
        }}
      >
        {list}
      </Drawer>
    </>
  );
}