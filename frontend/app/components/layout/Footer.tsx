import React from "react";
import { Box, Container, Typography, Link} from "@mui/material"

const Footer = () => {
    return (
        <Box component='footer' sx={{bgcolor: 'background.paper', py: 5}}>
            <Container maxWidth="lg">
                <Typography variant="body2" color='text.secondary' align="center" sx={{display: 'flex', justifyContent: 'Center', gap: 2, flexWrap: 'wrap'}}>
                    <Link color="inherit" href="https://github.com/KarolDawidG">
                        github.com
                    </Link>
                        KarolDawidG
                        {'© '}
                        {new Date().getFullYear()} 
                </Typography>
            </Container>
        </Box>
    )
}

export default Footer;