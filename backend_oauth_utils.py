"""
OAuth utility functions for KindleCast Backend

This module provides utility functions for OAuth redirect URL generation
and configuration management.
"""

import os
from typing import Optional
from authlib.integrations.starlette_client import OAuth


def get_oauth_redirect_url(provider: str, success: bool, error_message: Optional[str] = None) -> str:
    """
    Generate OAuth redirect URL for frontend
    
    Args:
        provider: OAuth provider name ('google' or 'amazon')
        success: Whether the OAuth flow was successful
        error_message: Error message if success is False
    
    Returns:
        Frontend redirect URL with appropriate query parameters
    """
    # Get frontend URL from environment or use default
    frontend_url = os.getenv('FRONTEND_URL', 'http://localhost:3000')
    
    if success:
        # Redirect to auth success page for token handling
        return f"{frontend_url}/auth/success?provider={provider}"
    else:
        # Redirect to home page with error parameters
        error_param = error_message or "Authentication failed"
        return f"{frontend_url}/?error={error_param}&provider={provider}"


class OAuthConfig:
    """OAuth configuration manager"""
    
    def __init__(self):
        self.oauth = OAuth()
        self._setup_providers()
    
    def _setup_providers(self):
        """Setup OAuth providers"""
        # Google OAuth
        google_client_id = os.getenv('GOOGLE_CLIENT_ID')
        google_client_secret = os.getenv('GOOGLE_CLIENT_SECRET')
        
        if google_client_id and google_client_secret:
            self.oauth.register(
                name='google',
                client_id=google_client_id,
                client_secret=google_client_secret,
                server_metadata_url='https://accounts.google.com/.well-known/openid_configuration',
                client_kwargs={
                    'scope': 'openid email profile'
                }
            )
        
        # Amazon OAuth
        amazon_client_id = os.getenv('AMAZON_CLIENT_ID')
        amazon_client_secret = os.getenv('AMAZON_CLIENT_SECRET')
        
        if amazon_client_id and amazon_client_secret:
            self.oauth.register(
                name='amazon',
                client_id=amazon_client_id,
                client_secret=amazon_client_secret,
                authorize_url='https://www.amazon.com/ap/oa',
                access_token_url='https://api.amazon.com/auth/o2/token',
                client_kwargs={
                    'scope': 'profile'
                }
            )
    
    def get_google_client(self):
        """Get Google OAuth client"""
        return self.oauth.google if hasattr(self.oauth, 'google') else None
    
    def get_amazon_client(self):
        """Get Amazon OAuth client"""
        return self.oauth.amazon if hasattr(self.oauth, 'amazon') else None


class OAuthUserInfo:
    """OAuth user information extractor"""
    
    @staticmethod
    async def get_google_user_info(token: dict) -> Optional[dict]:
        """Extract user info from Google OAuth token"""
        try:
            user_info = token.get('userinfo')
            if not user_info:
                return None
            
            return {
                'email': user_info.get('email'),
                'name': user_info.get('name'),
                'provider': 'google',
                'provider_id': user_info.get('sub'),
                'avatar_url': user_info.get('picture')
            }
        except Exception as e:
            print(f"Error extracting Google user info: {e}")
            return None
    
    @staticmethod
    async def get_amazon_user_info(token: dict) -> Optional[dict]:
        """Extract user info from Amazon OAuth token"""
        try:
            # Amazon requires a separate API call to get user profile
            import httpx
            
            access_token = token.get('access_token')
            if not access_token:
                return None
            
            async with httpx.AsyncClient() as client:
                response = await client.get(
                    'https://api.amazon.com/user/profile',
                    headers={'Authorization': f'Bearer {access_token}'}
                )
                
                if response.status_code != 200:
                    return None
                
                user_data = response.json()
                return {
                    'email': user_data.get('email'),
                    'name': user_data.get('name'),
                    'provider': 'amazon',
                    'provider_id': user_data.get('user_id'),
                    'avatar_url': None  # Amazon doesn't provide avatar URL
                }
        except Exception as e:
            print(f"Error extracting Amazon user info: {e}")
            return None


# Global OAuth configuration instance
oauth_config = OAuthConfig()
