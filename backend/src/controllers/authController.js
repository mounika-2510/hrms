const jwt = require('jsonwebtoken');
const { User, Organisation, Log } = require('../models');

const register = async (req, res, next) => {
  try {
    console.log('🔍 REGISTRATION ATTEMPT - Request body:', req.body);
    
    const { orgName, adminName, email, password } = req.body;

    // Validation
    if (!orgName || !adminName || !email || !password) {
      console.log('❌ Missing fields:', { orgName, adminName, email, password });
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 6) {
      console.log('❌ Password too short');
      return res.status(400).json({ message: 'Password must be at least 6 characters' });
    }

    console.log('✅ Basic validation passed');

    // Check if user exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      console.log('❌ Email already exists:', email);
      return res.status(409).json({ message: 'Email already registered' });
    }

    console.log('✅ Email is available');

    // Create organisation
    console.log('🔄 Creating organisation...');
    const organisation = await Organisation.create({ name: orgName });
    console.log('✅ Organisation created with ID:', organisation.id);

    // Create admin user
    console.log('🔄 Creating user...');
    const user = await User.create({
      organisation_id: organisation.id,
      email,
      password_hash: password, // This gets hashed automatically
      name: adminName
    });
    console.log('✅ User created with ID:', user.id);

    // Create log
    console.log('🔄 Creating log entry...');
    await Log.create({
      organisation_id: organisation.id,
      user_id: user.id,
      action: 'organisation_created',
      meta: { orgName, adminName, email }
    });
    console.log('✅ Log entry created');

    // Generate token
    const token = jwt.sign(
      { userId: user.id, orgId: organisation.id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret_for_dev',
      { expiresIn: '8h' }
    );

    console.log('🎉 REGISTRATION SUCCESSFUL for:', email);
    
    res.status(201).json({
      message: 'Organisation created successfully',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organisation: {
          id: organisation.id,
          name: organisation.name
        }
      }
    });

  } catch (error) {
    console.error('💥 REGISTRATION ERROR:', error);
    console.error('Error details:', error.message);
    console.error('Error stack:', error.stack);
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    console.log('🔍 LOGIN ATTEMPT:', req.body);
    
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user with organisation
    const user = await User.findOne({
      where: { email },
      include: [{ model: Organisation }]
    });

    if (!user) {
      console.log('❌ User not found:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Validate password
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
      console.log('❌ Invalid password for:', email);
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create log
    await Log.create({
      organisation_id: user.organisation_id,
      user_id: user.id,
      action: 'user_login',
      meta: { email }
    });

    // Generate token
    const token = jwt.sign(
      { userId: user.id, orgId: user.organisation_id, email: user.email },
      process.env.JWT_SECRET || 'fallback_secret_for_dev',
      { expiresIn: '8h' }
    );

    console.log('✅ LOGIN SUCCESSFUL for:', email);
    
    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        organisation: {
          id: user.Organisation.id,
          name: user.Organisation.name
        }
      }
    });

  } catch (error) {
    console.error('💥 LOGIN ERROR:', error);
    next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await Log.create({
      organisation_id: req.user.orgId,
      user_id: req.user.userId,
      action: 'user_logout',
      meta: { email: req.user.email }
    });

    res.json({ message: 'Logout successful' });
  } catch (error) {
    next(error);
  }
};

module.exports = { register, login, logout };