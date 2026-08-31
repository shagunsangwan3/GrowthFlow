from logging.config import fileConfig

from alembic import context

from app.config.settings import settings
from app.database.session import Base, engine

from app.models.user import User
from app.models.organization import Organization

# Other models — enable them when they are ready
# from app.models.lead import Lead
# from app.models.proposal import Proposal
# from app.models.activity import Activity
# from app.models.attachment import Attachment
# from app.models.notification import Notification
# from app.models.subscription import Subscription
# from app.models.payment import Payment
# from app.models.proposal_template import ProposalTemplate
# from app.models.email import Email
# from app.models.login_session import LoginSession


config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)


target_metadata = Base.metadata


def run_migrations_offline() -> None:
    """Run migrations in offline mode."""

    context.configure(
        url=settings.DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in online mode."""

    connectable = engine

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
