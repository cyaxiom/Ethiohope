export const can = {
  ownOrAny(user: any, resourceOwnerId: any, anyPermission: any) {
    if (user.permissions.includes(anyPermission)) {
      return true;
    }

    return resourceOwnerId.equals(user.id);
  }
};
