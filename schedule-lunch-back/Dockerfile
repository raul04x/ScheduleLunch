FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

COPY ScheduleLunchBack.slnx ./
COPY src/SL.Domain/SL.Domain.csproj src/SL.Domain/
COPY src/SL.Application/SL.Application.csproj src/SL.Application/
COPY src/SL.Infrastructure/SL.Infrastructure.csproj src/SL.Infrastructure/
COPY src/SL.Api/SL.Api.csproj src/SL.Api/
RUN dotnet restore src/SL.Api/SL.Api.csproj

COPY . .
RUN dotnet publish src/SL.Api/SL.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "SL.Api.dll"]
