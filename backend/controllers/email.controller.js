import userRepository from "../repository/user.repository.js";

export const codeAccount = async (req, res) => {
	try {
		if (res.headersSent) return;
		const { id } = req.body;
		setTimeout(
			() => {
				userRepository
					.updateVerifyCode(null, id)
					.then((rowCount) => {
						if (rowCount === 0) throw new Error("Verify code was not updated");
					})
					.catch((e) => console.log(e));
			},
			5 * 60 * 1000,
		);
		return res.status(200).json({ message: "Verify code was updated" });
	} catch (error) {
		console.log(error);
		res.status(500).json({ error: "Internal server error" });
	}
};
