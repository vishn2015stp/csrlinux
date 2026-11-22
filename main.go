package main

import (
	"embed"
	"io/fs"
	"log"

	"github.com/pocketbase/pocketbase"
	"github.com/pocketbase/pocketbase/apis"
	"github.com/pocketbase/pocketbase/core"
	"github.com/pocketbase/pocketbase/plugins/migratecmd"
	"github.com/pocketbase/pocketbase/tools/osutils"

	_ "myapp/migrations"
)

//go:embed all:dist
var uiEmbed embed.FS

func main() {
	app := pocketbase.New()

	migratecmd.MustRegister(app, app.RootCmd, migratecmd.Config{
		Automigrate: osutils.IsProbablyGoRun(),
	})

	app.OnServe().BindFunc(func(se *core.ServeEvent) error {
		distFS, err := fs.Sub(uiEmbed, "dist")
		if err != nil {
			log.Fatal("Failed to locate embedded UI directory: ", err)
		}

		se.Router.GET("/{path...}", apis.Static(distFS, true))

		return se.Next()
	})

	if err := app.Start(); err != nil {
		log.Fatal(err)
	}
}
