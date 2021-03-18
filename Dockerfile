FROM nikolaik/python-nodejs:python3.8-nodejs15

# Install Python Stuff
RUN pip install django djangorestframework django-rest-knox psycopg2

# Move Stuff to a new place
WORKDIR /usr/app
COPY ./ /usr/app
RUN cd /usr/app/

# Configure npm and build site
RUN npm init -y
RUN npm i -D webpack webpack-cli @babel/core babel-loader @babel/preset-env @babel/preset-react babel-plugin-transform-class-properties
RUN npm i react react-dom prop-types axios react-dom react-redux redux redux-devtools-extension redux-thunk remote-redux-devtools
RUN npm run dev

# Expose port
EXPOSE 8000

# Run on Entry
CMD cd /usr/app/XChemSPA ; python ./manage.py migrate ; python ./manage.py runserver 0.0.0.0:8000
