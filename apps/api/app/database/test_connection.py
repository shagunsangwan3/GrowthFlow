from app.database.session import engine
from sqlalchemy import text

connection = engine.connect()

result = connection.execute(text("SELECT 1"))
print(result.fetchone())