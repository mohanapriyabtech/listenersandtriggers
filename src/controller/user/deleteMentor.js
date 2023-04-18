import { Mentor } from "../../model/mentor";
import { responseHandler } from "../../response/responseHandler";

export const deleteMentor = async (req, res) => {
  try {
    const id = req.params.id;
    const mentor = await Mentor.findByIdAndDelete({ _id: id });
    return responseHandler(res, 200, "Mentor deleted successfully");
  } catch (err) {
    return responseHandler(res, 500, err.message);
  }
};
