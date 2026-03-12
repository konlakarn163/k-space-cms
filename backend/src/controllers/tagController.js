import {
  createMasterTag,
  deleteMasterTag,
  listMasterTags,
  updateMasterTag,
} from '../services/tagService.js';

export const listTagsController = async (_req, res) => {
  try {
    const tags = await listMasterTags();
    res.json(tags);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

export const createTagController = async (req, res) => {
  try {
    const tag = await createMasterTag({ name: req.body.name });
    res.status(201).json(tag);
  } catch (err) {
    if (err.message.includes('duplicate') || err.message.includes('unique')) {
      return res.status(409).json({ error: 'Tag already exists' });
    }
    res.status(400).json({ error: err.message });
  }
};

export const updateTagController = async (req, res) => {
  try {
    const tag = await updateMasterTag({ id: req.params.id, name: req.body.name });
    res.json(tag);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

export const deleteTagController = async (req, res) => {
  try {
    await deleteMasterTag({ id: req.params.id });
    res.status(204).end();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
