# To jest entrypoint do wszystkich komend w poniższym README aka musicie mieć w konsoli .../mongo żeby poniższe działało. Czyli:

```
cd mongo
```

## Obsługa kontera mongo

1. Odpalić dockera
2. komendy do odpalenia nowej bazki

```
docker-compose down -v
  docker-compose up
```

3. This is connection string:

```
mongodb://admin:password@localhost:27017/

```

4. Używajcie lokalnie zainstalowanego compassa aby podejrzeć dane.

5. Seedowanie
   - Wpisać komendy:

````npm i
    npm run seed```
````
