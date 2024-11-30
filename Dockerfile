FROM postgres:13

# Set the working directory
WORKDIR /docker-entrypoint-initdb.d

# Copy the dump file into the container
COPY dump.sql /docker-entrypoint-initdb.d/

# When the container starts, the dump.sql file will be loaded automatically