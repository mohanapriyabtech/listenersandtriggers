import { Mentor } from "../../model/mentor";
import { responseHandler } from "../../response/responseHandler";

export const getAllMentor = async (req, res) => {
  try {
    const mentor = await Mentor.find({})
      .populate("subject", {
        name: 1,
      }).select("-class")
      .populate("school_name");
    return responseHandler(
      res,
      200,
      "Mentor details sent successfully",
      mentor
    );
  } catch (err) {
    return responseHandler(res, 500, err.message);
  }
};
