#/bin/sh

# mup.json
sed 's/$PRODUCTION_MUP_HOST/'"$PRODUCTION_MUP_HOST"'/' -i mup.json
sed 's/$PRODUCTION_MUP_USERNAME/'"$PRODUCTION_MUP_USERNAME"'/' -i mup.json
sed 's/$PRODUCTION_MUP_PUBLIC_KEY_PATH/'"$PUBLIC_KEY_MUP_PATH"'/' -i mup.json
sed 's/$PRODUCTION_MUP_ROOT_URL/'"$PRODUCTION_MUP_ROOT_URL"'/' -i mup.json
sed 's/$PRODUCTION_MUP_KADIRA_APP_ID/'"$PRODUCTION_MUP_KADIRA_APP_ID"'/' -i mup.json
sed 's/$PRODUCTION_MUP_KADIRA_APP_SECRET/'"$PRODUCTION_MUP_KADIRA_APP_SECRET"'/' -i mup.json
sed 's/$PRODUCTION_MUP_SSL_CERTIFICATE_PATH/'"$PRODUCTION_MUP_SSL_CERTIFICATE_PATH"'/' -i mup.json
sed 's/$PRODUCTION_MUP_SSL_KEY_PATH/'"$PRODUCTION_MUP_SSL_KEY_PATH"'/' -i mup.json

# settings.json
sed 's/$PRODUCTION_SETTINGS_PUBLIC_CUSTOMER_NAME/'"$PRODUCTION_SETTINGS_PUBLIC_CUSTOMER_NAME"'/' -i settings.json
sed 's/$PRODUCTION_SETTINGS_PRIVATE_ADMIN_DEFAULTACCOUNT_USERNAME/'"$PRODUCTION_SETTINGS_PRIVATE_ADMIN_DEFAULTACCOUNT_USERNAME"'/' -i settings.json
sed 's/$PRODUCTION_SETTINGS_PRIVATE_ADMIN_DEFAULTACCOUNT_PASSWORD/'"$PRODUCTION_SETTINGS_PRIVATE_ADMIN_DEFAULTACCOUNT_PASSWORD"'/' -i settings.json
sed 's/$PRODUCTION_SETTINGS_PRIVATE_ADMIN_DEFAULTACCOUNT_EMAIL/'"$PRODUCTION_SETTINGS_PRIVATE_ADMIN_DEFAULTACCOUNT_EMAIL"'/' -i settings.json
sed 's/$PRODUCTION_SETTINGS_PRIVATE_ADMIN_DEFAULTACCOUNT_PROFILE_FIRSTNAME/'"$PRODUCTION_SETTINGS_PRIVATE_ADMIN_DEFAULTACCOUNT_PROFILE_FIRSTNAME"'/' -i settings.json
sed 's/$PRODUCTION_SETTINGS_PRIVATE_ADMIN_DEFAULTACCOUNT_PROFILE_LASTNAME/'"$PRODUCTION_SETTINGS_PRIVATE_ADMIN_DEFAULTACCOUNT_PROFILE_LASTNAME"'/' -i settings.json
