const userModel = require("../model/userModel");
const bookModel = require("../model/bookModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.adminlogin = async (req, res) => {
  try {
    console.log(req.body, "body");
    const userFind = await userModel.findOne({
      email: req.body.email,
    });
    console.log(userFind, "find");
    if (!userFind) {
      return res.status(400).json({
        status: false,
        message: "User email does not exists",
        data: {},
      });
    }
    const matchedpassword = await bcrypt.compare(
      req.body.password,
      userFind.password
    );
    console.log(matchedpassword, "hashedPassword");

    if (matchedpassword) {
      let jwtSecretKey = process.env.JWT_SECRET_KEY;
      let data = {
        userId: userFind._id,
        email: userFind.email,
        role: userFind.role,
      };

      const token = jwt.sign(data, jwtSecretKey, { expiresIn: "60m" });
      userFind.password = "";
      //   userFind.token = token;
      // userFind.profile_pic = userFind.profile_pic ? path.join(__dirname +  '../../uploads/' + userFind.profile_pic): ""
      userFind.profile_pic = userFind.profile_pic
        ? "http://localhost:3000/" + userFind.profile_pic
        : "";

      const userData = { ...userFind._doc, token };
      // console.log(__dirname, 'dirname', path.join(__dirname +  '../../uploads/' + userFind.profile_pic))
      return res.status(201).json({
        message: "admin Login Successfully",
        status: true,
        data: userData,
      });
    } else {
      return res.status(400).json({
        message: "Password is not Correct",
        status: false,
        data: {},
      });
    }
  } catch (err) {
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.createBook = async (req, res) => {
  try {
    console.log(req.body, req.file, "body");
    const userFind = await bookModel.findOne({
      book_name: req.body.book_name,
    });
    if (userFind) {
      return res.status(400).json({
        status: false,
        message: "Book name already exists",
        data: {},
      });
    }

    const userSaved = await bookModel.create({
      book_name: req.body.book_name,
      author_name: req.body.author_name,
      price: req.body.price,
      quantity: req.body.quantity,
      description: req.body.description,
      book_pic: req.file.originalname,
    });

    if (userSaved) {
      return res.status(201).json({
        message: "book Created Successfully",
        status: true,
        data: userSaved,
      });
    }
  } catch (err) {
    console.log(err, "error");
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
      data: {},
    });
  }
};

exports.deleteBook = async (req, res) => {
  try {
    const bookDelete = await bookModel.findByIdAndDelete({
      _id: req.params.bookId,
    });

    if (!bookDelete) {
      return res.status(400).json({
        message: "book is not deleted Successfully",
        status: false,
      });
    }
    return res.status(200).json({
      message: "book deleted Successfully",
      status: true,
    });
  } catch (err) {
    console.log(err, "error");
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
    });
  }
};

exports.getBookById = async (req, res) => {
  try {
    const bookDelete = await bookModel.findOne({
      _id: req.params.bookId,
    });

    if (!bookDelete) {
      return res.status(400).json({
        message: "book is not find",
        status: false,
        data: {},
      });
    }
    return res.status(200).json({
      message: "book find Successfully",
      status: true,
      data: bookDelete._doc,
    });
  } catch (err) {
    console.log(err, "error");
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
      data: {},
    });
  }
};


exports.updateBook = async (req, res) => {
  try {
    const bookDelete = await bookModel.findOne({
      _id: req.params.bookId,
    });

    if (!bookDelete) {
      return res.status(400).json({
        message: "book is not find",
        status: false,
        data: {},
      });
    }
    var updatePic = ''
    if(req.file)
    {
        updatePic = req.file.originalName
    }

   const book = await bookModel.findOneAndUpdate({ "_id": req.params.bookId }, { "$set": { "book_name": req.body.book_name ? req.body.book_name : bookDelete.book_name, "author_name": req.body.author_name ? req.body.author_name : bookDelete.author_name,
       "price": req.body.price ? req.body.price : bookDelete.price,
      "quantity": req.body.quantity ? req.body.quantity : bookDelete.quantity,
      "description": req.body.description ? req.body.description : bookDelete.description,
      "book_pic": updatePic != "" ? updatePic : bookDelete.book_pic

    }})
    
      
        return res.status(200).json({
          message: "book  update Successfully",
          status: false,
          data: book,
        });
      
   
   
  } catch (err) {
    console.log(err, "error");
    return res.status(500).json({
      message: "Internal Server Error",
      status: false,
      data: {},
    });
  }
};
