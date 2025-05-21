import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY')
    DEBUG = False
    NUM_DRIVERS = 200
    MIN_COMPENSATION = 5.0
    MAX_COMPENSATION = 30.0
    BASE_COMP_MIN = 0.0
    BASE_COMP_MAX = 100.0

class DevelopmentConfig(Config):
    DEBUG = True

class ProductionConfig(Config):
    pass