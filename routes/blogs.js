const express = require('express');
const { body, validationResult } = require('express-validator');
const Blog = require('../models/Blog');
const auth = require('../middleware/auth');

const router = express.Router();

// Get all blogs (public)
router.get('/', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const filter = { status: 'published' };
    
    // Filter by category if provided
    if (req.query.category) {
      filter.category = req.query.category;
    }
    
    // Search functionality
    if (req.query.search) {
      filter.$text = { $search: req.query.search };
    }

    const blogs = await Blog.find(filter)
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments(filter);

    res.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get blogs error:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
});

// Get single blog by slug
router.get('/:slug', async (req, res) => {
  try {
    const blog = await Blog.findOne({ 
      slug: req.params.slug, 
    status: 'published' 
    })
      .populate('author', 'username avatar bio')
      .populate('comments.user', 'username avatar');

    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Increment view count
    blog.viewCount += 1;
    await blog.save();

    res.json({ blog });
  } catch (error) {
    console.error('Get blog error:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
});

// Create new blog (protected)
router.post('/', auth, [
  body('title')
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('content')
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long'),
  body('category')
    .isIn(['Technology', 'Lifestyle', 'Business', 'Health', 'Education', 'Entertainment', 'Sports', 'Other'])
    .withMessage('Invalid category')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category, tags, featuredImage, status } = req.body;

    const blog = new Blog({
      title,
      content,
      category,
      author: req.userId,
      tags: tags || [],
      featuredImage: featuredImage || '',
      status: status || 'draft'
    });

    await blog.save();
    await blog.populate('author', 'username avatar');

    res.status(201).json({
      message: 'Blog created successfully',
      blog
    });
  } catch (error) {
    console.error('Create blog error:', error);
    res.status(500).json({ error: 'Failed to create blog' });
  }
});

// Update blog (protected - only author)
router.put('/:id', auth, [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 1, max: 200 })
    .withMessage('Title must be between 1 and 200 characters'),
  body('content')
    .optional()
    .trim()
    .isLength({ min: 10 })
    .withMessage('Content must be at least 10 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to update this blog' });
    }

    const { title, content, category, tags, featuredImage, status } = req.body;

    if (title) blog.title = title;
    if (content) blog.content = content;
    if (category) blog.category = category;
    if (tags) blog.tags = tags;
    if (featuredImage !== undefined) blog.featuredImage = featuredImage;
    if (status) blog.status = status;

    await blog.save();
    await blog.populate('author', 'username avatar');

    res.json({
      message: 'Blog updated successfully',
      blog
    });
  } catch (error) {
    console.error('Update blog error:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
});

// Delete blog (protected - only author)
router.delete('/:id', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    // Check if user is the author
    if (blog.author.toString() !== req.userId) {
      return res.status(403).json({ error: 'Not authorized to delete this blog' });
    }

    await Blog.findByIdAndDelete(req.params.id);

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('Delete blog error:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
});

// Like/Unlike blog (protected)
router.post('/:id/like', auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const likeIndex = blog.likes.indexOf(req.userId);
    
    if (likeIndex > -1) {
      // Unlike
      blog.likes.splice(likeIndex, 1);
      await blog.save();
      return res.json({ message: 'Blog unliked', liked: false });
    } else {
      // Like
      blog.likes.push(req.userId);
      await blog.save();
      return res.json({ message: 'Blog liked', liked: true });
    }
  } catch (error) {
    console.error('Like blog error:', error);
    res.status(500).json({ error: 'Failed to like blog' });
  }
});

// Add comment to blog (protected)
router.post('/:id/comments', auth, [
  body('content')
    .trim()
    .isLength({ min: 1, max: 1000 })
    .withMessage('Comment must be between 1 and 1000 characters')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const blog = await Blog.findById(req.params.id);
    
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found' });
    }

    const { content } = req.body;
    
    blog.comments.push({
      user: req.userId,
      content
    });

    await blog.save();
    await blog.populate('comments.user', 'username avatar');

    res.status(201).json({
      message: 'Comment added successfully',
      comment: blog.comments[blog.comments.length - 1]
    });
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ error: 'Failed to add comment' });
  }
});

// Get user's blogs (protected)
router.get('/user/my-blogs', auth, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    
    const blogs = await Blog.find({ author: req.userId })
      .populate('author', 'username avatar')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Blog.countDocuments({ author: req.userId });

    res.json({
      blogs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user blogs error:', error);
    res.status(500).json({ error: 'Failed to fetch user blogs' });
  }
});

module.exports = router;
