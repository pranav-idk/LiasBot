  
const { OWNERS,
    STAFF
} = require(`../config.json`);

module.exports = async (user, perms) => {
    if (OWNERS.includes(user.id) || STAFF.includes(user.id)) return true;
    if (!perms) return false;
    if (user.hasPermission([perms])) return true;
    else return require(`./sortPermissions.js`)(perms);
};