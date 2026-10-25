from fastapi import Depends
from fastapi import HTTPException

from app.dependencies import get_current_user



# Super Admin Only
def require_super_admin(

    current_user=Depends(get_current_user)

):

    if current_user.role != "SUPER_ADMIN":

        raise HTTPException(

            status_code=403,

            detail="Only Super Admin can access this resource."

        )

    return current_user


# Sub Admin or Super Admin
def require_sub_admin(

    current_user=Depends(get_current_user)

):

    if current_user.role not in [

        "SUPER_ADMIN",

        "SUB_ADMIN"

    ]:

        raise HTTPException(

            status_code=403,

            detail="Access Denied."

        )

    return current_user


# Any Logged In User
def require_user(

    current_user=Depends(get_current_user)

):

    return current_user