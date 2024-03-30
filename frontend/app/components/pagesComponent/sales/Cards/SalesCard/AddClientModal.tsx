import React from 'react';
import {
    Modal,
    Backdrop,
    Fade,
    Typography,
    Box,
    Button,
} from '@mui/material';

const AddClientModal: React.FC<{ open: boolean; onClose: () => void }> = ({open, onClose}) => {

    return (
        <Modal
            open={open}
            onClose={onClose}
            aria-labelledby="order-details-modal-title"
            aria-describedby="order-details-modal-description"
            closeAfterTransition
            slots={{
                backdrop: Backdrop,
            }}
            slotProps={{backdrop: {timeout: 500,},}}>

            <Fade in={open}>
                <Box sx={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, minWidth: '400px', maxWidth: '80vw', maxHeight: '80vh', overflowY: 'auto', borderRadius: '8px',}}>
                    <Typography variant="h6" id="order-details-modal-title" gutterBottom>
                        Dodawanie klienta
                    </Typography>
                    <Box>

                        <Typography variant="subtitle1">
                            Tutaj bedzie formularz z danymi
                        </Typography>

                    </Box>
                    <Box sx={{ mt: 2 }}>
                        <Button onClick={onClose} variant="outlined" color="primary">
                            Zamknij
                        </Button>
                    </Box>
                </Box>
            </Fade>
        </Modal>
    );
};

export default AddClientModal;
