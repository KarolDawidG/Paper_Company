import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import { notify } from "@/app/components/notification/Notify";
import { Box, Typography, Button, TextField, LinearProgress } from "@mui/material";
import Image from "next/image";
import logo from "../../public/logo.png";
import Footer from "@/app/components/layout/Footer";
import useTranslation from "@/app/components/language/useTranslation";
import useTranslationStatus from "@/app/components/language/useTranslationStatus";

export default function Reset() {
  const router = useRouter();
  const BACKEND = process.env.NEXT_PUBLIC_BACKEND as string;
  const { slug } = router.query;
  const [password, setPassword] = useState("");
  const [password2, setPassword2] = useState("");
  const passwordsMatch = password === password2;
  const handleMain = () => {
    router.push("/");
  };

  const currentLocale = localStorage.getItem("locale") || "en";
  const t = useTranslation(currentLocale);
  const isTranslationLoaded = useTranslationStatus(currentLocale);

  let id: any, token: any;
  if (router.query.slug && Array.isArray(router.query.slug)) {
    [id, token] = router.query.slug;
  }

  useEffect(() => {
    if (!id || !token) {
      return;
    }

    const handleResetLink = async () => {
      try {
        const response = await axios.get(`${BACKEND}/${id}/${token}`);
        if (response.status !== 200) {
          notify(response.data.message);
        }
      } catch (error: any) {
        console.error(error);
      }
    };
    handleResetLink();
  }, [id, token]);

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    if (!passwordsMatch) {
      return;
    }

    if (slug && Array.isArray(slug) && slug.length === 2) {
      const [id, token] = slug;
      try {
        const response = await axios.post(`${BACKEND}/reset/${id}/${token}`, {
          password,
          password2,
        });

        if (response.status === 200) {
          setTimeout(() => router.push("/"), 2000);
          if (isTranslationLoaded) {
            notify(`${t.notification.correct}`);
            return;
        }
        }
      } catch (error) {
        if (isTranslationLoaded) {
          notify(`${t.notification.error}`);
          return;
      }
      }
    }
  };

  if (!t.notification) {
    return <LinearProgress />;
  }
  
  return (
    <Box display="flex" flexDirection="column" minHeight="100vh">
      <Box flexGrow={1} textAlign="center" my={1}>
        <Image src={logo} alt="Logo" width={250} height={250} />
        <Typography variant="h4" gutterBottom>
          {t.notification.reser_password}
        </Typography>
        <form onSubmit={handleSubmit}>
          <Box
            sx={{
              mt: 2,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <TextField
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder={t.notification.new_password}
              required
            />
            <TextField
              type="password"
              value={password2}
              onChange={(e) => setPassword2(e.target.value)}
              placeholder={t.notification.confirm_password}
              required
            />
            <Button
              type="submit"
              disabled={!passwordsMatch}
              variant="contained"
              sx={{ mt: 1 }}
            >
              {t.notification.reser_password}
            </Button>
            <Button variant="contained" sx={{ mt: 1 }} onClick={handleMain}>
              S{t.notification.main_page}
            </Button>
          </Box>
        </form>
      </Box>
      <Footer />
    </Box>
  );
}
