import * as profileService from "../services/profile.services.js";

export const get_profiles = async (req, res) => {
    try {
        const rows = await profileService.get_profiles();
        res.send(rows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const get_recent_profiles = async (req, res) => {
    try {
        const formattedRows = await profileService.get_recent_profiles();
        res.send(formattedRows);
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const get_profile = async (req, res) => {
    try {
        let { username } = req.params;
        const profile = await profileService.get_profile(username);

        if (!profile) return res.status(404).json({ message: "Profile not found" });

        return res.status(200).send(profile.toPublic());
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const get_private_profile = async (req, res) => {
    try {
        let { username } = req.params;
        if (req.user.username !== username) {
            return res.status(403).json({ message: "Forbidden: You can only access your own private profile" });
        }

        const profile = await profileService.get_profile(username); // Reutilizamos el get del service
        if (!profile) return res.status(404).json({ message: "Profile not found" });

        return res.status(200).send(profile.toJSON());
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const post_profile = async (req, res) => {
    try {
        await profileService.post_profile();
        return res.status(201).json({ message: "Profile created" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const delete_profile = async (req, res) => {
    try {
        await profileService.delete_profile();
        res.status(200).json({ message: "Profile deleted" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const put_profile = async (req, res) => {
    try {
        await profileService.put_profile();
        res.status(200).json({ message: "Profile updated" });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};

export const patch_profile = async (req, res) => {
    try {
        const { username } = req.params;
        if (req.user.username !== username) {
            return res.status(403).json({ message: "Forbidden: You can only update your own profile" });
        }

        const imageUrl = await profileService.patch_profile(username, req.body, req.file);
        return res.status(200).json({ message: "Profile updated successfully", imageUrl });
    } catch (error) {
        if (error.message === "PROFILE_NOT_FOUND") return res.status(404).json({ message: "Profile not found" });
        console.log("Error in patch_profile:", error);
        res.status(500).json({ message: "Error en el servidor" });
    }
};