# 4. (ご参考)使用したYAML

- 本テキストで利用した`petstore_0830.yaml`を以下に記載します
- ハンズオンのお供にどうぞ
```yaml
openapi: 3.0.0
info:
  version: 1.0.0
  title: Machida Petstore
  license:
    name: MIT
  description: Documentation of Machida Petstore API
  contact:
    name: NoriakiMachida
    email: methimo.wk@gmail.com
servers:
  - url: 'http://localhost:8080/v1'
paths:
  /pets:
    get:
      summary: List all pets
      operationId: listPets
      tags:
        - pets
      parameters:
        - name: limit
          in: query
          description: How many items to return at one time (max 100)
          required: false
          schema:
            type: integer
            format: int32
      responses:
        '200':
          description: A paged array of pets
          headers: {}
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pets'
              examples:
                Example:
                  value:
                    - id: 1234
                      name: Pochi
                      tag: dog
                      breed: Poodle
                    - id: 2345
                      name: Tama
                      tag: cat
                      breed: American Short Hair
        default:
          description: unexpected error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
      description: Desctibe Pets
    post:
      summary: Create a pet
      operationId: createPets
      tags:
        - pets
      responses:
        '200':
          description: OK
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pet'
              examples:
                Example:
                  value:
                    id: 3456
                    name: Gow
                    tag: lion
                    breed: None
        '400':
          description: Bad Request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              examples:
                Example:
                  value:
                    code: 400
                    message: Invalid Request(TestMessage)
        default:
          description: NormalEnd Reaponse
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pet'
              examples:
                Example:
                  value:
                    id: 3456
                    name: Gow
                    tag: lion
                    breed: None
      requestBody:
        content:
          application/json:
            schema:
              type: object
              properties:
                name:
                  type: string
                  example: Gaw
                  minLength: 0
                  maxLength: 20
                tag:
                  type: string
                  example: lion
                breed:
                  type: string
              required:
                - name
                - tag
            examples:
              Example:
                value:
                  name: Gaw
                  tag: lion
        description: Request Body Description
      description: Create Pet
    parameters: []
  '/pets/{petId}':
    get:
      summary: Info for a specific pet
      operationId: showPetById
      tags:
        - pets
      parameters:
        - name: petId
          in: path
          required: true
          description: The id of the pet to retrieve
          schema:
            type: string
      responses:
        '200':
          description: Expected response to a valid request
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Pet'
              examples:
                Example:
                  value:
                    id: 1234
                    name: Pochi
                    tag: dog
                    breed: Poodle
        default:
          description: unexpected error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/Error'
              examples: {}
components:
  schemas:
    Pet:
      type: object
      properties:
        id:
          type: integer
          format: int64
          example: 1234
          minimum: 1
          maximum: 9999
        name:
          type: string
          example: Pochi
          minLength: 1
          maxLength: 20
        tag:
          type: string
          example: dog
        breed:
          type: string
          example: Poodle
      required:
        - id
        - name
    Pets:
      type: array
      items:
        $ref: '#/components/schemas/Pet'
    Error:
      type: object
      required:
        - code
        - message
      properties:
        code:
          type: integer
          format: int32
          example: 409
        message:
          type: string
          example: Test Error Message
```