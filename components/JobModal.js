import { Modal, Typography, Box, Avatar } from "@mui/material";
import React from "react";

const JobDescription = ({ job, jobModal, setJobModal }) => {
  const handleClose = () => {
    setJobModal(false);
  };

  return (
    <Modal
      open={jobModal}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: 400,
          bgcolor: "background.paper",
          boxShadow: 24,
          p: 4,
        }}
      >
         <Avatar alt={job?.Job_Title} src={job?.Logo_URL} sx={{ width: 60, height: 60, margin: "auto" }} />
        <Typography variant="h6" component="h2">
          {job?.Job_Title}
        </Typography>
        <Typography sx={{ mt: 2 }}>
          <strong>Company:</strong> {job?.Company_Name}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <strong>Location:</strong> {job?.Location}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <strong>Description:</strong> {job?.Job_Description}
        </Typography>
        <Typography sx={{ mt: 1 }}>
          <strong>Close Date:</strong> {job?.Application_Close_Date}
        </Typography>
        {/* You can add more details here based on your job object */}
      </Box>
    </Modal>
  );
};

export default JobDescription;
