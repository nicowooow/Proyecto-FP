import * as userVerificationService from "../services/user_verification.services.js";

export const codeAccount = async (req, res) => {
    try {
        const { id } = req.body;
        
        await userVerificationService.scheduleCodeExpiration(id);

        return res.status(200).json({ 
            message: "Verify code was updated" 
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: "Internal server error" });
    }
};