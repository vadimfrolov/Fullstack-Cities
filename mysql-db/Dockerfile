FROM mysql

ENV MYSQL_ROOT_PASSWORD=root_password_1234
ENV MYSQL_DATABASE=cities_record_db
ENV MYSQL_USER=developer
ENV MYSQL_PASSWORD=generic_password
ENV MYSQL_TCP_PORT=3307

EXPOSE 3307

COPY init.sql /docker-entrypoint-initdb.d/

VOLUME /var/lib/mysql
