import Profile from "../models/Profile.js";
import fs from 'fs';
import path from 'path';

// Get all profiles
export const getAllProfiles = async (req, res) => {
    try {
      const profiles = await Profile.find().lean(); // Add .lean() to get plain JS objects
      // Transform data to match frontend expectations
      const transformedData = profiles.map(profile => ({
        id: profile._id,
        name: profile.name,
        email: profile.email,
        phoneNo: profile.phoneNo,
        pic: profile.pic,
        skills: profile.skills,
        nickname: profile.nickname,
        address: profile.address,
        funFact: profile.funFact,
        rating: profile.rating,
        role: profile.role,
        joiningDate: profile.joiningDate
        // Explicitly exclude _id, __v, etc.
      }))
      res.json(transformedData);
    } catch (error) {
      console.error("Error fetching profiles:", error);
      // Try fallback to local JSON
      try {
        const rawData = fs.readFileSync(path.join(__dirname, '../../data/data.json'), 'utf-8');
        res.json(JSON.parse(rawData));
      } catch (fileError) {
        res.status(500).json({ error: "All data sources failed" });
      }
    }
  };

// Create a new profile
export const createProfile = async (req, res) => {
  try {
    const newProfile = new Profile({
      name: req.body.name,
      email: req.body.email,
      address: req.body.address,
      phoneNo: req.body.phoneNo,
      funFact: req.body.funFact,
      joiningDate: req.body.joiningDate,
      pic: req.file ? `http://localhost:5000/uploads/${req.file.filename}` : "http://localhost:5000/uploads/default.jpg",
      skills: req.body.skills || "React, Node.js",
      nickname: "Newbie",
      rating: 3.5,
      role: "Intern"
    });

    const savedProfile = await newProfile.save();
    res.status(201).json({
      success: true,
      message: 'Profile created successfully',
      data: savedProfile
    });
  } catch (error) {
    console.error('Error creating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create profile',
      error: error.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { email, name, rating, phoneNo, address } = req.body;
    
    console.log('Request body:', req.body); // Debugging line
    // Update MongoDB using findOneAndUpdate
    const updatedProfile = await Profile.findOneAndUpdate(
      { email },  // find by email
      { 
        $set: {   // use $set to update specific fields
          name,
          rating: parseFloat(rating),
          phoneNo,
          address,
          updatedAt: new Date()  // track last update time
        }
      },
      { 
        new: true,       // return updated document
        runValidators: true  // run model validations
      }
    );

    if (!updatedProfile) {
      return res.status(404).json({
        success: false,
        message: 'Profile not found'
      });
    }

    // Transform the response to match frontend expectations
    const transformedProfile = {
      id: updatedProfile._id,
      name: updatedProfile.name,
      email: updatedProfile.email,
      phoneNo: updatedProfile.phoneNo,
      address: updatedProfile.address,
      rating: updatedProfile.rating,
      pic: updatedProfile.pic,
      role: updatedProfile.role,
      skills: updatedProfile.skills,
      funFact: updatedProfile.funFact,
      joiningDate: updatedProfile.joiningDate
    };

    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: transformedProfile
    });

  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};