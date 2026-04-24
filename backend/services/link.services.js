import linkRepository from "./../repository/link.repository.js";
import Link from "./../models/link.model.js";

export const getLinksByProfile = async (profileId) => {
    const rows = await linkRepository.getLinks(profileId);
    if (rows.length === 0) throw new Error("LINKS_NOT_FOUND");
    
    return rows.map((row) => new Link(row).toPublic());
};

export const getLinkById = async (id) => {
    const rows = await linkRepository.getLink(id);
    if (rows.length === 0) throw new Error("LINK_NOT_FOUND");
    
    return rows.map((row) => new Link(row).toPublic());
};

export const createLink = async (body) => {
    let { profile_id, title, url, url_image, position, is_visible } = body;
    
    const p_id = parseInt(profile_id);
    const pos = parseInt(position) || 0;

    const rowCount = await linkRepository.createLink(
        p_id,
        title,
        url,
        url_image,
        pos,
        is_visible
    );

    if (rowCount === 0) throw new Error("LINK_NOT_CREATED");
    return rowCount;
};

export const deleteLink = async (id) => {
    const rowCount = await linkRepository.deleteLink(id);
    if (rowCount === 0) throw new Error("LINK_NOT_FOUND");
    return rowCount;
};

export const updateLink = async (id, body) => {
    let { title, url, url_image, position, is_visible } = body;
    
    const linkId = parseInt(id);
    const pos = parseInt(position, 10) || 0;

    const rowCount = await linkRepository.putLink(
        linkId,
        title,
        url,
        url_image,
        pos,
        is_visible
    );

    if (rowCount === 0) throw new Error("LINK_NOT_FOUND");
    return rowCount;
};

export const patchLink = async (id, body) => {
    let { title, url, url_image, position, is_visible } = body;
    
    const linkId = parseInt(id);
    let pos = position;
    if (pos !== undefined) pos = parseInt(pos, 10) || 0;

    const rowCount = await linkRepository.patchLink(
        linkId,
        title,
        url,
        url_image,
        pos,
        is_visible
    );

    if (rowCount === 0) throw new Error("LINK_NOT_FOUND");
    return rowCount;
};