import styleRepository from "./../repository/style.repository.js";
export const get_styles = async (req, res) => {
  try {
    let rows = await styleRepository.getStyles();
   
    if (rows.length === 0) {
      return res.status(200).json({
        mensagge: "there are no styles related to your search yet",
        data: [],
      });
    }

    return res.status(200).json({
      messagge: `styles found`,
      data: rows,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error : " + error });
  }
};

export const get_style = async (req, res) => {
  try {
    let { id } = req.params;
    let rows = await styleRepository.getStyle(id);


    if (rows.length === 0) {
      return res.status(404).json({
        messagge: `style with id ${id} not found`,
        data: [],
      });
    }

    return res.status(200).send(rows[0]);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error : " + error });
  }
};

export const post_style = async(req, res) => {
  try {
    let { title, style } = req.body;
    let rowCount = await styleRepository.createStyle(title, style)
    if(rowCount !== 0){
      res.status(201).json({
        message: `the style has been created successfully`,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error : " + error });
  }
};

export const delete_style = async (req, res) => {
  try {
    let { id } = req.params;
    
    let rowCount = await styleRepository.deleteStyle(id);
    if (rowCount === 0) {
      return res
        .status(404)
        .json({ mensagge: `the style with id ${id} doesn't exist` });
    }

    return res.status(200).json({
      mensagge: `the style with id ${id} has been deleted successfully`,
    });

    // o sino enviamos solo el estado de que fue eliminado con el 204:
    // return res.sendStatus(204);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error : " + error });
  }
};

export const put_style = async (req, res) => {
  try {
    let { id } = req.params;
    let { title, style } = req.body;
    let rowCount = await styleRepository.putStyle(id, title, style);
    if (rowCount === 0) {
      return res
        .status(404)
        .json({ mensagge: `the style with id ${id} doesn't exist` });
    }
    return res.status(200).json({
      "message":"the style was changed successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error : " + error });
  }
};

export const patch_style = async (req, res) => {
  try {
    let { id } = req.params;
    let { title, style } = req.body;
    // si el valor es nulo, se mantiene el valor actual de la columna usando COALESCE
    let rowCount = await styleRepository.patchStyle(id, title, style);
    if (rowCount === 0) {
      return res
        .status(404)
        .json({ mensagge: `the style with id ${id} doesn't exist` });
    }
    return res.status(200).json({
      "message":"the style was changed successfully"
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Server error : " + error });
  }
};
