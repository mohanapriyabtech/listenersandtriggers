
import { User } from "../../model/user";
import { responseHandler } from "../../response/responseHandler";

export const userCreation = async (req, res) => {
  try {
    const user = new User({
      name: req.body.name,
    
    });
    await user.save();
    return responseHandler(res, 200, "Mentor created successfully", user);
  } catch (err) {
    return responseHandler(res, 500, err.message);
  }
};
