const Address = require("../models/addressModel");

// Add a new address
exports.addAddress = async (req, res) => {
  try {
    const { label, street, city, state, zip, country, isDefault } = req.body;

    if (!street || !city || !zip) {
      return res.status(400).json({ message: "Street, city, and zip are required" });
    }

    if (isDefault) {
      // Make sure only one default address exists
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    const address = await Address.create({
      user: req.user._id,
      label,
      street,
      city,
      state,
      zip,
      country,
      isDefault: !!isDefault
    });

    res.status(201).json({ message: "Address added", address });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all addresses for logged-in user
exports.getAddresses = async (req, res) => {
  try {
    const addresses = await Address.find({ user: req.user._id });
    res.status(200).json({ message: "User addresses", addresses });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update an existing address
exports.updateAddress = async (req, res) => {
  try {
    const { addressId } = req.params;
    const { label, street, city, state, zip, country, isDefault } = req.body;

    const address = await Address.findOne({ _id: addressId, user: req.user._id });
    if (!address) return res.status(404).json({ message: "Address not found" });

    if (isDefault) {
      await Address.updateMany({ user: req.user._id }, { isDefault: false });
    }

    Object.assign(address, { label, street, city, state, zip, country, isDefault });
    await address.save();

    res.status(200).json({ message: "Address updated", address });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete an address
exports.deleteAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const address = await Address.findOneAndDelete({ _id: addressId, user: req.user._id });
    if (!address) return res.status(404).json({ message: "Address not found" });

    res.status(200).json({ message: "Address deleted", address });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Set default address
exports.setDefaultAddress = async (req, res) => {
  try {
    const { addressId } = req.params;

    const address = await Address.findOne({ _id: addressId, user: req.user._id });
    if (!address) return res.status(404).json({ message: "Address not found" });

    await Address.updateMany({ user: req.user._id }, { isDefault: false });

    address.isDefault = true;
    await address.save();

    res.status(200).json({ message: "Default address set", address });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
}