from djoser.serializers import UserCreateSerializer as BaseUserCreateSerializer
from django.contrib.auth import get_user_model


class CustomUserCreateSerializer(BaseUserCreateSerializer):
    """
    Djoser user-create serializer that tolerates missing username by deriving
    it from the email's local-part and ensuring uniqueness.
    """

    class Meta(BaseUserCreateSerializer.Meta):
        # Keep Djoser's defaults, but allow username to be optional in input
        fields = ("id", "email", "password", "username", "first_name", "last_name")

    def validate(self, attrs):
        attrs = super().validate(attrs)
        username = attrs.get("username")
        email = (attrs.get("email") or "").strip()
        if not username:
            base = (email.split("@")[0] or "user").replace(" ", "").lower()
            User = get_user_model()
            candidate = base or "user"
            n = 1
            while User.objects.filter(username=candidate).exists():
                n += 1
                candidate = f"{base}{n}"
            attrs["username"] = candidate
        return attrs
