export const SELECT_BY_ID:string = `
SELECT pt.* FROM product_translations pt JOIN languages l ON pt.language_id = l.id
  WHERE pt.product_id = ?
    AND l.code = ?;
`;

export const SELECT_ALL_PRODUCTS:string = `SELECT p.id, COALESCE(pt.name, p.name) AS name, 
          COALESCE(pt.description, p.description) AS description, p.category, p.price, p.stock, p.created_at
          FROM products p
          LEFT JOIN product_translations pt ON p.id = pt.product_id 
          AND pt.language_id = (SELECT id FROM languages WHERE code = ?);`