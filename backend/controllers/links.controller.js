import * as linkService from "../services/link.services.js";

export const get_links = async (req, res) => {
    try {
        const { profileId } = req.params;
        const data = await linkService.getLinksByProfile(profileId);
        
        return res.status(200).json(data);
    } catch (error) {
        if (error.message === "LINKS_NOT_FOUND") {
            return res.status(404).json({ message: "No links found" });
        }
        return res.status(500).json({ message: "Server error : " + error.message });
    }
};

export const get_link = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await linkService.getLinkById(id);
        
        return res.status(200).json(data);
    } catch (error) {
        if (error.message === "LINK_NOT_FOUND") {
            return res.status(404).json({ message: "Link not found" });
        }
        return res.status(500).json({ message: "Server error : " + error.message });
    }
};

export const post_link = async (req, res) => {
    try {
        await linkService.createLink(req.body);
        return res.status(201).json({ message: "Link created successfully" });
    } catch (error) {
        if (error.message === "LINK_NOT_CREATED") {
            return res.status(400).json({ message: "Failed to create link" });
        }
        return res.status(500).json({ message: "Server error : " + error.message });
    }
};

export const delete_link = async (req, res) => {
    try {
        const { id } = req.params;
        await linkService.deleteLink(id);
        return res.status(200).json({ message: "Link deleted successfully" });
    } catch (error) {
        if (error.message === "LINK_NOT_FOUND") {
            return res.status(404).json({ message: "Link not found" });
        }
        return res.status(500).json({ message: "Server error : " + error.message });
    }
};

export const put_link = async (req, res) => {
    try {
        const { id } = req.params;
        await linkService.updateLink(id, req.body);
        return res.status(200).json({ message: "Link updated successfully" });
    } catch (error) {
        if (error.message === "LINK_NOT_FOUND") {
            return res.status(404).json({ message: "Link not found" });
        }
        return res.status(500).json({ message: "Server error : " + error.message });
    }
};

export const patch_link = async (req, res) => {
    try {
        const { id } = req.params;
        await linkService.patchLink(id, req.body);
        return res.status(200).json({ message: "Link partially updated successfully" });
    } catch (error) {
        if (error.message === "LINK_NOT_FOUND") {
            return res.status(404).json({ message: "Link not found" });
        }
        return res.status(500).json({ message: "Server error : " + error.message });
    }
};