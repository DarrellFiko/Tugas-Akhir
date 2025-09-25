import { useEffect, useState } from "react";
import {
  Box,
  Grid,
  Card,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Link,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  Visibility,
  VisibilityOff,
  LockOutlined,
} from "@mui/icons-material";
import AccountCircleOutlinedIcon from '@mui/icons-material/AccountCircleOutlined';
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";

import logoCarolus from "../../assets/images/logoCarolus.png";
import logoTarakanita from "../../assets/images/logoTarakanita.png";
import bgLogin from "../../assets/images/bgLogin.jpeg";

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();

  // Toggle password visibility
  const [visible, setVisible] = useState(false);

  // React Hook Form setup
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      username: "siswa01",
      password: "123",
    },
  });

  // Methods
  const onSubmit = (data) => {
    if (data.username && data.password) {
      onLogin(data);
    }
  };

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (token) {
      navigate("/dashboard", { replace: true });
    }
  }, [navigate]);

  return (
    <Grid
      container
      alignItems="center"
      justifyContent="center"
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${bgLogin})`,
        backgroundSize: "cover",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
      }}
    >
      <Grid
        sx={{
          maxWidth: 1160,
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
        }}
      >
        <Grid container justifyContent="center" gap={3}>
          {/* Left side (Form) */}
          <Grid  xs={12} md={6} sx={{ my: 3 }}>
            <motion.div
              initial={{ opacity: 0, x: -80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <Card sx={{ p: 4, borderRadius: 3, boxShadow: 6 }}>
                <Box sx={{ mb: 4, textAlign: "center" }}>
                  <img src={logoCarolus} alt="Logo Carolus" width={200} />
                </Box>

                <Typography
                  variant="h4"
                  fontWeight="bold"
                  textAlign="center"
                  gutterBottom
                >
                  Login
                </Typography>
                <Typography
                  variant="body1"
                  textAlign="center"
                  color="text.secondary"
                  sx={{ mb: 3 }}
                >
                  Enter your username and password to login
                </Typography>

                {/* Form start */}
                <form onSubmit={handleSubmit(onSubmit)}>
                  {/* Username */}
                  <Typography variant="subtitle2" color="text.secondary">
                    Username
                  </Typography>
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    placeholder="Username"
                    {...register("username", {
                      required: "Username is required",
                      minLength: {
                        value: 3,
                        message: "Username must be at least 3 characters",
                      },
                    })}
                    error={!!errors.username}
                    helperText={errors.username?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <AccountCircleOutlinedIcon />
                        </InputAdornment>
                      ),
                    }}
                  />

                  {/* Password */}
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mt: 2 }}
                  >
                    Password
                  </Typography>
                  <TextField
                    fullWidth
                    margin="dense"
                    variant="outlined"
                    type={visible ? "text" : "password"}
                    placeholder="Password"
                    {...register("password", {
                      required: "Password is required",
                      // minLength: {
                      //   value: 6,
                      //   message: "Password must be at least 6 characters",
                      // },
                    })}
                    error={!!errors.password}
                    helperText={errors.password?.message}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            onClick={() => setVisible(!visible)}
                            edge="end"
                          >
                            {visible ? <VisibilityOff /> : <Visibility />}
                          </IconButton>
                        </InputAdornment>
                      ),
                      inputProps: {
                        autoComplete: "new-password",
                      },
                    }}
                    sx={{
                      "& input[type=password]::-ms-reveal": { display: "none" },
                      "& input[type=password]::-ms-clear": { display: "none" },
                      "& input[type=password]::-webkit-credentials-auto-fill-button": {
                        display: "none",
                      },
                    }}
                  />

                  {/* Forgot Password */}
                  <Box textAlign="right" mt={2}>
                    <Link
                      href="#"
                      underline="hover"
                      variant="caption"
                      color="primary"
                    >
                      Forgot password?
                    </Link>
                  </Box>

                  {/* Login Button */}
                  <Button
                    fullWidth
                    variant="contained"
                    color="primary"
                    sx={{ mt: 3, fontWeight: "bold" }}
                    type="submit"
                  >
                    Login
                  </Button>
                </form>
                {/* Form end */}
              </Card>
            </motion.div>
          </Grid>

          {/* Right side (Image) */}
          <Grid
            md={6}
            sx={{
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
              alignItems: "center",
              p: 3,
              borderRadius: 3,
              background: "rgba(255, 255, 255, 0.2)",
              backdropFilter: "blur(5px)",
              border: "1px solid rgba(255, 255, 255, 0.3)",
            }}
          >
            <motion.img
              src={logoTarakanita}
              alt="Logo Tarakanita"
              style={{ maxWidth: 400, maxHeight: 540 }}
              initial={{ opacity: 0, x: 80 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
            />
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
}
