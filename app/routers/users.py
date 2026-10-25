from fastapi import APIRouter
from fastapi import Depends

from app.dependencies import get_current_user


router = APIRouter(

    prefix="/users",

    tags=["Users"]

)


@router.get(
    "/me"
)

def get_profile(

    current_user=Depends(
        get_current_user
    )

):

    return {

        "id":
            current_user.id,

        "full_name":
            current_user.full_name,

        "email":
            current_user.email,

        "age":
            current_user.age,

        "occupation":
            current_user.occupation,

        "organization_id":
            current_user.organization_id,

        "role":
            current_user.role,

        "preferred_language":
            current_user.preferred_language

    }