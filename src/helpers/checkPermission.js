const checkPermission = (interaction, allowedRoles) => {
    const userRoles = interaction.member.roles.cache;
    return allowedRoles.some(roleId => userRoles.has(roleId));
}
module.exports = checkPermission